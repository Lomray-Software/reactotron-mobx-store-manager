export default {
  branches: [
    'prod',
    {
      name: 'staging',
      prerelease: 'beta',
      channel: 'beta',
    },
  ],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    '@semantic-release/npm',
    ["@semantic-release/github", {
      "assets": [
        {"path": "build.zip", "label": "Build-${nextRelease.gitTag}"},
      ]
    }],
  ]
}
