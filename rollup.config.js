import typescript from 'rollup-plugin-ts';
import terser from '@rollup/plugin-terser';

const IS_DEVELOP_BUILD = process.env.BUILD === 'development'

export default {
  input: 'src/index.ts',
  output: {
    dir: IS_DEVELOP_BUILD ? 'example/lib' : 'lib',
    format: 'es',
    preserveModules: true,
    exports: 'auto',
  },
  external: [
    'react',
    'mobx',
    'hoist-non-react-statics',
    'mobx-react-lite',
    'lodash',
    '@lomray/react-mobx-manager',
    '@lomray/event-manager'
  ],
  plugins: [
    typescript({
      tsconfig: resolvedConfig => ({
        ...resolvedConfig,
        declaration: true,
        importHelpers: true,
      }),
    }),
    terser(),
  ],
};
