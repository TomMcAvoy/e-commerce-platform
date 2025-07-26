interface IUser {
    _id: string;
    id: string;
    getSignedJwtToken(): string;
    comparePassword(password: string): Promise<boolean>;
}

const user: IUser = {
    _id: 'some_id',
    id: 'some_id',
    getSignedJwtToken: function() {
        return 'some_token';
    },
    comparePassword: async function(password: string) {
        return password === 'correct_password';
    }
};

const token = user.getSignedJwtToken();
const id = user._id;
const isMatch = await user.comparePassword('password');
const foundUser = await User.findById(req.user?.id);