// GROQ queries for Sanity
export const BIOGRAPHY_QUERY = `*[_type == "biography" && assignedPage->pageType == "about"] | order(sortOrder asc) {
  _id,
  title,
  content,
  sortOrder,
  assignedPage->{
    title,
    pageType
  }
}`
