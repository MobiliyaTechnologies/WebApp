See the general Documentation guidelines http://docs.gitlab.com/ce/development/doc_styleguide.html

## What does this MR do?

(briefly describe what this MR is about)

## Moving docs to a new location?

See the guidelines: http://docs.gitlab.com/ce/development/doc_styleguide.html#changing-document-location

- [ ] Make sure the old link is not removed and has its contents replaced with a link to the new location.
- [ ] Make sure internal links pointing to the document in question are not broken.
- [ ] Search and replace any links referring to old docs in GitLab Rails app, specifically under the `app/views/` directory.
- [ ] If working on CE, submit an MR to EE with the changes as well.
