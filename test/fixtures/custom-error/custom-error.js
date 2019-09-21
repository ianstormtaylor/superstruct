import { superstruct } from '../../..'

class StructErrorWithoutValue extends TypeError {
    static format(attrs) {
      const { type, path } = attrs;
      const message = `Expected a value of type \`${type}\`${path.length ? ` for \`${path.join('.')}\`` : ''}.`;
      return message;
    }
  
    constructor(attrs) {
      const message = StructErrorWithoutValue.format(attrs);
      super(message);
  
      const { path, reason, type, errors = [] } = attrs;
      this.path = path;
      this.reason = reason;
      this.type = type;
      this.errors = errors.map(error => {
        delete error.value;
        delete error.data;
        return error;
      });
  
      if (!errors.length) {
        errors.push(this);
      }
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      } else {
        this.stack = (new Error()).stack;
      }
    }
  }

const struct = superstruct({
    error: StructErrorWithoutValue,
})

export const Struct = struct('number')

export const data = 'invalid'

export const error = {
  path: [],
  type: 'number',
  reason: null,
}
