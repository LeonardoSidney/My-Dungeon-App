export type FormErrors = {
    name?: string;
    ip?: string;
    port?: string;
};

export type ConnectionFormData = {
    name: string;
    ip: string;
    port: string;
    auth: string;
    id?: string;
    createdAt?: Date;
    updatedAt?: Date;
};

export function setInitialConnectionState (): ConnectionFormData {
    return {
        name: '',
        ip: '',
        port: '',
        auth: '',
    };
}
