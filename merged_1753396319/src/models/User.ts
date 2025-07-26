interface IUser {
    _id: string;
    id: string;
    getSignedJwtToken(): string;
    comparePassword(password: string): Promise<boolean>;
}

export default IUser;