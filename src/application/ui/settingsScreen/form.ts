import { Connection } from '@domain/entities';
import {
    CreateConnectionConfigControllerRequest,
    EditConnectionControllerParams,
    ICreateConnectionConfigController,
    IEditConnectionController,
} from '@domain/controllers';
import { ConnectionFormData, FormErrors } from './constants';
import { ControllerResponse } from '@application/ui/hooks';

export function toConnectionFormState (connection: Connection): ConnectionFormData {
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

function connectionPortNumber (form: ConnectionFormData): number | undefined {
    const parsedPort = parseInt(form.port, 10);
    if (Number.isNaN(parsedPort)) {
        return undefined;
    }
    return parsedPort;
}

export function toCreateParams (form: ConnectionFormData): CreateConnectionConfigControllerRequest {
    const auth = form.auth.trim();
    const port = connectionPortNumber(form);
    return {
        name: form.name.trim(),
        ip: form.ip.trim(),
        port,
        auth: auth || undefined,
    };
}

export function toEditParams (form: ConnectionFormData & { id: string; }): EditConnectionControllerParams {
    const auth = form.auth.trim();
    const port = connectionPortNumber(form);
    return {
        id: form.id,
        editParams: {
            name: form.name.trim(),
            ip: form.ip.trim(),
            port,
            auth: auth || undefined,
        },
    };
}

export function validateConnectionForm (form: ConnectionFormData): FormErrors {
    const errors: FormErrors = {};
    if (!form.name.trim()) {
        errors.name = 'Name is required';
    }
    if (!form.ip.trim()) {
        errors.ip = 'IP Address is required';
    }
    if (!form.port.trim()) {
        errors.port = 'Port is required';
        return errors;
    }
    const parsedPort = parseInt(form.port, 10);
    if (Number.isNaN(parsedPort)) {
        errors.port = 'Port must be a number';
    }
    return errors;
}

export function submitConnection (
    form: ConnectionFormData,
    createConnectionConfig: ICreateConnectionConfigController,
    editConnection: IEditConnectionController
): Promise<ControllerResponse> {
    if (form.id) {
        const editForm = { ...form, id: form.id };
        return editConnection.handle(toEditParams(editForm));
    }
    return createConnectionConfig.handle(toCreateParams(form));
}
