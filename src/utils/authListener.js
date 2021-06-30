export default ({ payload: { event } }) => {
    switch (event) {
        case 'signIn':
            // console.log('Sign In', data)
            break;
        case 'signUp':
            // console.info('Sign Up', data);
            break;

        case 'signOut':
            // console.log('Sign Out')
            break;
    }
};
