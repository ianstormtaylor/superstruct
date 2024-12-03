export default function transformer(file, api) {
  const j = api.jscodeshift
  const root = j(file.source)

  const variablesToFind = ['Struct', 'data', 'output', 'create', 'failures']

  let assertOrCreate = 'assert' // Default to "assert"
  let dataDeclaration = null
  let structExpression = null
  let failureValue = null
  let createValue = null
  let outputValue = null

  // Define import specifiers
  const expectSpecifier = j.importSpecifier(j.identifier('expect'))
  const itSpecifier = j.importSpecifier(j.identifier('test'))
  const validateSpecifier = j.importSpecifier(j.identifier('validate'))

  // Define import declarations
  const vitestImportDeclaration = j.importDeclaration(
    [expectSpecifier, itSpecifier],
    j.literal('vitest')
  )

  // Find existing import declarations
  const existingImports = root.find(j.ImportDeclaration)

  // Handle import for vitest
  const hasVitestImport = existingImports
    .nodes()
    .some(
      (importDecl) =>
        importDecl.source.value === 'vitest' &&
        importDecl.specifiers.some(
          (specifier) =>
            specifier.imported.name === 'expect' ||
            specifier.imported.name === 'test'
        )
    )

  if (!hasVitestImport) {
    // Add the new import declaration for `vitest` to the top of the file
    root.find(j.Program).get('body', 0).insertBefore(vitestImportDeclaration)
  }

  // Handle import for "../../../src"
  const srcImport = existingImports.find(j.ImportDeclaration, {
    source: { value: '../../../src' },
  })

  // Iterate over the identifiers to find the relevant ones
  root.find(j.VariableDeclarator).forEach((path) => {
    const name = path.node.id.name

    if (variablesToFind.includes(name)) {
      if (name === 'create') {
        createValue = path.node.init
        if (
          createValue &&
          createValue.type === 'Literal' &&
          createValue.value === true
        ) {
          assertOrCreate = 'create'
        }
      } else if (name === 'data') {
        // Save the entire data variable declaration
        dataDeclaration = j.variableDeclaration('const', [
          j.variableDeclarator(path.node.id, path.node.init),
        ])
      } else if (name === 'Struct') {
        structExpression = path.node.init // Use the expression directly
      } else if (name === 'failures') {
        failureValue = path.node.init // Use the expression directly
      } else if (name === 'output') {
        outputValue = path.node.init // Use the expression directly
      }
    }
  })

  if (failureValue !== null) {
    if (srcImport.length > 0) {
      // Add `validate` to the existing import declaration
      srcImport.forEach((importDecl) => {
        if (
          !importDecl.node.specifiers.some(
            (specifier) => specifier.imported.name === 'validate'
          )
        ) {
          importDecl.node.specifiers.push(validateSpecifier)
        }
      })
    } else {
      // Optionally handle the case where the import statement does not exist
      // Here you can choose to add a new import declaration for `validate` if needed
      const newSrcImportDeclaration = j.importDeclaration(
        [validateSpecifier],
        j.literal('../../../src')
      )
      // Add the new import declaration to the top of the file
      root.find(j.Program).get('body', 0).insertBefore(newSrcImportDeclaration)
    }
  } else if (srcImport.length > 0) {
    // Add `validate` to the existing import declaration
    srcImport.forEach((importDecl) => {
      if (
        !importDecl.node.specifiers.some(
          (specifier) => specifier.imported.name === assertOrCreate
        )
      ) {
        importDecl.node.specifiers.push(
          j.importSpecifier(j.identifier(assertOrCreate))
        )
      }
    })
  } else {
    // Optionally handle the case where the import statement does not exist
    // Here you can choose to add a new import declaration for `validate` if needed
    const newSrcImportDeclaration = j.importDeclaration(
      [j.importSpecifier(j.identifier(assertOrCreate))],
      j.literal('../../../src')
    )
    // Add the new import declaration to the top of the file
    root.find(j.Program).get('body', 0).insertBefore(newSrcImportDeclaration)
  }

  // Remove the original data declaration from the root
  if (dataDeclaration) {
    root
      .find(j.VariableDeclaration)
      .filter((path) =>
        path.node.declarations.some((decl) => decl.id.name === 'data')
      )
      .remove()
  }

  // Remove the original Struct declaration from the root
  if (createValue) {
    root
      .find(j.VariableDeclaration)
      .filter((path) =>
        path.node.declarations.some((decl) => decl.id.name === 'create')
      )
      .remove()
  }

  // Remove the original Struct declaration from the root
  if (structExpression) {
    root
      .find(j.VariableDeclaration)
      .filter((path) =>
        path.node.declarations.some((decl) => decl.id.name === 'Struct')
      )
      .remove()
  }

  // Remove the original Struct declaration from the root
  if (outputValue) {
    root
      .find(j.VariableDeclaration)
      .filter((path) =>
        path.node.declarations.some((decl) => decl.id.name === 'output')
      )
      .remove()
  }

  // Remove the original Struct declaration from the root
  if (failureValue) {
    root
      .find(j.VariableDeclaration)
      .filter((path) =>
        path.node.declarations.some((decl) => decl.id.name === 'failures')
      )
      .remove()
  }

  // Remove empty export statements
  root
    .find(j.ExportNamedDeclaration)
    .filter((path) => path.node.specifiers.length === 0)
    .remove()

  const validateOptions = j.objectExpression([
    j.property('init', j.identifier('coerce'), j.literal(true)),
  ])

  // Convert the filename to the test name
  const fileName = file.path
    .replace(/.*\/|\.ts$/g, '') // Remove the path and file extension
    .toLowerCase()

  const path = file.path.split('/') // Extract the folder name
  const folderName = path[path.length - 2]

  const testName = fileName.toLowerCase().replace('-', ' ').split(' ')

  let finalTestName = [testName[0], folderName, ...testName.slice(1)].join(' ')

  finalTestName = finalTestName.charAt(0).toUpperCase() + finalTestName.slice(1)

  finalTestName = finalTestName.replace('-', ' ')

  const testFunction = j.callExpression(j.identifier('test'), [
    j.literal(finalTestName),
    j.arrowFunctionExpression(
      [],
      failureValue !== null
        ? j.blockStatement([
            dataDeclaration,
            j.variableDeclaration('const', [
              j.variableDeclarator(
                j.arrayPattern([j.identifier('err'), j.identifier('res')]),
                j.callExpression(
                  j.identifier('validate'),
                  assertOrCreate === 'create'
                    ? [j.identifier('data'), structExpression, validateOptions]
                    : [j.identifier('data'), structExpression]
                )
              ),
            ]),
            j.expressionStatement(
              j.callExpression(
                j.memberExpression(
                  j.callExpression(j.identifier('expect'), [
                    j.identifier('res'),
                  ]),
                  j.identifier('toBeUndefined')
                ),
                []
              )
            ),
            j.expressionStatement(
              j.callExpression(
                j.memberExpression(
                  j.callExpression(j.identifier('expect'), [
                    j.identifier('err'),
                  ]),
                  j.identifier('toMatchStructError')
                ),
                [failureValue]
              )
            ),
          ])
        : assertOrCreate === 'create'
          ? j.blockStatement([
              dataDeclaration,
              j.variableDeclaration('const', [
                j.variableDeclarator(
                  j.identifier('res'),
                  j.callExpression(j.identifier(assertOrCreate), [
                    j.identifier('data'),
                    structExpression,
                  ])
                ),
              ]),
              j.expressionStatement(
                j.callExpression(
                  j.memberExpression(
                    j.callExpression(j.identifier('expect'), [
                      j.identifier('res'),
                    ]),
                    j.identifier('toStrictEqual')
                  ),
                  [outputValue]
                )
              ),
            ])
          : j.blockStatement([
              dataDeclaration,
              j.expressionStatement(
                j.callExpression(j.identifier(assertOrCreate), [
                  j.identifier('data'),
                  structExpression,
                ])
              ),
              j.expressionStatement(
                j.callExpression(
                  j.memberExpression(
                    j.callExpression(j.identifier('expect'), [
                      j.identifier('data'),
                    ]),
                    j.identifier('toStrictEqual')
                  ),
                  [outputValue]
                )
              ),
            ])
    ),
  ])

  root.get().node.program.body.push(j.expressionStatement(testFunction))

  return root.toSource()
}
