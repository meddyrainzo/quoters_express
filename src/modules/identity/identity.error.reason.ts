enum IdentityErrorReason {
    INVALID_EMAIL = 'The email entered was invalid',
    SHORT_PASSWORD = 'Password too short. It should contain at least 6 characters',
    LONG_PASSWORD = 'The first name is too long. It should contain at most 125 characters',
    SHORT_FIRSTNAME = 'First name too short. It should contain at least one letter',
    LONG_FIRSTNAME = 'The first name is too long. It should contain at most 25 letters',
    SHORT_LASTNAME = 'Last name too short. It should contain at least one letter',
    LONG_LASTNAME = 'The last name is too long. It should contain at most 25 letters',
    INVALID_STRING = 'should only contain characters',
    INVALID_LOGIN = 'Incorrect email or password',
    REQUIRED = 'is required',
    INCORRECT_OLDPASSWORD = 'The old password is incorrect'
}

export default IdentityErrorReason;