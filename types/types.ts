export enum QuizTypes {
    trueOrFalse = "true_or_false",
    multipleOptions = "multiple_choice"
}

export interface IQuestion {
    question: string;
}

export enum Role {
    admin = "admin",
    user = "user",
    superAdmin = "super-admin"
}