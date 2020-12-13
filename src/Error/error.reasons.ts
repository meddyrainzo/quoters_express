enum ErrorReasons {
    UNAUTHORIZED  = "Unauthorized to perform this action",
    INVALID_CURRENTPAGE = "The currentPage query parameter is invalid",
    INVALID_RESULTSPERPAGE = "The resultsPerPage query parameter is invalid",
    REQUIRED = 'is required',
    INVALID_STRING = 'should only contain characters',
}

export default ErrorReasons;