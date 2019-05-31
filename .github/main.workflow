----- put the content below in .github/main.workflow -----
workflow "Groom Release PR" {
  on = "push"
  resolves = ["release-pr"]
}

action "release-pr" {
  uses = "googleapis/release-please/.github/action/release-please@master"
  env = {
    PACKAGE_NAME = "require-so-slow"
    RELEASE_PLEASE_COMMAND = "release-pr"
  }
  secrets = ["GITHUB_TOKEN"]
}

workflow "GitHub Release" {
  on = "push"
  resolves = ["github-release"]
}

action "github-release" {
  uses = "googleapis/release-please/.github/action/release-please@master"
  env = {
    PACKAGE_NAME = "require-so-slow"
    RELEASE_PLEASE_COMMAND = "github-release"
  }
  secrets = ["GITHUB_TOKEN"]
}
        
