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
};
