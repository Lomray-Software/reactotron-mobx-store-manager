# Reactotron plugin for [Mobx stores manager](https://github.com/Lomray-Software/react-mobx-manager)

Inspect stores owned by `@lomray/react-mobx-manager` in Reactotron. This is not a generic plugin for every MobX store: it reads that manager's store registry and relationships.

## Version and safety

This README describes `@lomray/reactotron-mobx-store-manager@1.2.0`. Stable releases use `prod`; `staging` is the beta branch even though it is the repository default. Declared peers include `@lomray/event-manager`, `@lomray/react-mobx-manager >=2.0.0`, Lodash `>=4.0.0` and MobX `>=6.7.0`. Those ranges are not a verified compatibility matrix.

Load the Reactotron configuration only in development. The plugin can expose store values and restore backups into live stores. Do not connect production data or secrets to an untrusted debugger. `defaultSubscribe` defaults to `'*'`; setting it to `false` disables that default path, not explicit subscriptions or backup requests.

The plugin returns an `onCommand` handler, not a public disposer. Configure it once at app bootstrap, not on every component mount. Constructing a new handler removes previously tracked static subscriptions, but this is not a documented disconnect cleanup API.

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

<!-- docs-example: reactotron -->
```ts
import Reactotron from 'reactotron-react-native';
import MobxStoreManagerPlugin from '@lomray/reactotron-mobx-store-manager';

const reactotron = Reactotron
  .configure()
  .use(MobxStoreManagerPlugin({ defaultSubscribe: false }))
  .connect();
```

Import this file only from a development-only entry point. The example assumes your app already initializes `@lomray/react-mobx-manager`; without its stores there is no managed state to inspect. Reactotron desktop connectivity and native transport must be verified in the consuming app.

## Bugs and feature requests

Bug or a feature request, [please open a new issue](https://github.com/Lomray-Software/reactotron-mobx-store-manager/issues/new).

## Copyright

Code and documentation copyright 2022 the [Lomray Software](https://lomray.com/). 
