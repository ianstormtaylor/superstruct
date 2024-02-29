/* eslint-disable */
//prettier-ignore
module.exports = {
name: "@yarnpkg/plugin-allow-scripts",
factory: function (require) {
var plugin=(()=>{var l=Object.defineProperty;var s=Object.getOwnPropertyDescriptor;var a=Object.getOwnPropertyNames;var c=Object.prototype.hasOwnProperty;var p=(t=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(t,{get:(o,e)=>(typeof require<"u"?require:o)[e]}):t)(function(t){if(typeof require<"u")return require.apply(this,arguments);throw new Error('Dynamic require of "'+t+'" is not supported')});var u=(t,o)=>{for(var e in o)l(t,e,{get:o[e],enumerable:!0})},f=(t,o,e,r)=>{if(o&&typeof o=="object"||typeof o=="function")for(let i of a(o))!c.call(t,i)&&i!==e&&l(t,i,{get:()=>o[i],enumerable:!(r=s(o,i))||r.enumerable});return t};var m=t=>f(l({},"__esModule",{value:!0}),t);var g={};u(g,{default:()=>d});var n=p("@yarnpkg/shell"),x={hooks:{afterAllInstalled:async()=>{let t=await(0,n.execute)("yarn run allow-scripts");t!==0&&process.exit(t)}}},d=x;return m(g);})();
return plugin;
}
};
