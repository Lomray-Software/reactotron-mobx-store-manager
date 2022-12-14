# Reactotron plugin for [Mobx stores manager](https://github.com/Lomray-Software/react-mobx-manager)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=reactotron-mobx-store-manager&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=reactotron-mobx-store-manager)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=reactotron-mobx-store-manager&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=reactotron-mobx-store-manager)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=reactotron-mobx-store-manager&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=reactotron-mobx-store-manager)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=reactotron-mobx-store-manager&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=reactotron-mobx-store-manager)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=reactotron-mobx-store-manager&metric=bugs)](https://sonarcloud.io/summary/new_code?id=reactotron-mobx-store-manager)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=reactotron-mobx-store-manager&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=reactotron-mobx-store-manager)

<p float="center">
  <img src="https://raw.githubusercontent.com/Lomray-Software/reactotron-mobx-store-manager/staging/example/demo1.jpg" alt="Reactotron demo 1" width="300"/>
  <img src="https://raw.githubusercontent.com/Lomray-Software/reactotron-mobx-store-manager/staging/example/demo2.jpg" alt="Reactotron demo 2" width="300"/>
</p>

## Table of contents

- [Getting started](#getting-started)
- [Bugs and feature requests](#bugs-and-feature-requests)
- [Copyright](#copyright)


## Getting started

The package is distributed using [npm](https://www.npmjs.com/), the node package manager.

```
npm i --save-dev @lomray/reactotron-mobx-store-manager
```

In your `ReactotronConfig.js`:

```jsx
import MobxStoreManagerPlugin from '@lomray/reactotron-mobx-store-manager';

const reactotron = Reactotron
  .configure()
  .use(MobxStoreManagerPlugin()) // connect plugin
  .connect()
```

## Bugs and feature requests

Bug or a feature request, [please open a new issue](https://github.com/Lomray-Software/reactotron-mobx-store-manager/issues/new).

## Copyright

Code and documentation copyright 2022 the [Lomray Software](https://lomray.com/). 
