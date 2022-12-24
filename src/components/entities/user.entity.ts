export interface User {
    id: number;
    name: string;
    age: number;
    email: string;
    avatarUrl: string;
}

export interface UserCreateModel {
    name: string;
    age: number;
    email: string;
    avatarUrl: string;
}

export interface ResponseUser {
    statusCode : number;
    message: string;
    data:User[];
}