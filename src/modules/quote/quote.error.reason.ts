enum QuoteErrorReason {
    NOT_FOUND = 'No quote found for the given id',
    QUOTE_TOO_SMALL = 'The quote should have at least 1 character',
    QUOTE_TOO_LONG = 'The quote should have at most 250 characters',
    AUTHOR_TOO_SHORT = "The author's name should be more than one character long",
    AUTHOR_TOO_LONG = "The author's name is too long!"
}

export default QuoteErrorReason;