import {
    ConnectionDetails,
    CreateConnectionConfigControllerRequest,
    ICreateConnectionConfigController,
    IEditConnectionController,
} from '@domain/controllers';
import { ControllerResponse } from '@presentation/hooks';

export type ConnectionFormData = {
    id: string;
    name: string;
    ip: string;
    port: string;
    auth: string;
};

export type ConnectionFormErrors = {
    name?: string;
    ip?: string;
    port?: string;
};

export function toConnectionFormState (connection: ConnectionDetails): ConnectionFormData {
    return {
        id: connection.id,
        name: connection.name,
        ip: connection.ip,
        port: connection.port?.toString() ?? '',
        auth: connection.auth ?? '',
    };
}

export function initialConnectionForm (): ConnectionFormData {
    return {
        id: '',
        name: '',
        ip: '',
        port: '',
        auth: '',
    };
}

function parsePort (port: string): number | undefined {
    const parsedPort = parseInt(port, 10);
    return Number.isNaN(parsedPort) ? undefined : parsedPort;
}

function toConnectionRequest (form: ConnectionFormData): CreateConnectionConfigControllerRequest {
    return {
        name: form.name.trim(),
        ip: form.ip.trim(),
        port: parsePort(form.port),
        auth: form.auth.trim() || undefined,
    };
}

function validatePort (port: string): string | undefined {
    if (!port.trim()) {
        return 'Port is required';
    }
    if (parsePort(port) === undefined) {
        return 'Port must be a number';
    }
    return undefined;
}

export function validateConnectionForm (form: ConnectionFormData): ConnectionFormErrors {
    const errors: ConnectionFormErrors = {};
    if (!form.name.trim()) {
        errors.name = 'Name is required';
    }
    if (!form.ip.trim()) {
        errors.ip = 'IP Address is required';
    }
    const portError = validatePort(form.port);
    if (portError) {
        errors.port = portError;
    }
    return errors;
}

export function submitConnection (
    form: ConnectionFormData,
    createConnectionConfig: ICreateConnectionConfigController,
    editConnection: IEditConnectionController,
): Promise<ControllerResponse> {
    if (form.id) {
        return editConnection.handle({ id: form.id, editParams: toConnectionRequest(form) });
    }
    return createConnectionConfig.handle(toConnectionRequest(form));
}
