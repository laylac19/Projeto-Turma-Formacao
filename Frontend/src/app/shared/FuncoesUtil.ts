import {Confirmation} from 'primeng';

export class FuncoesUtil {

    public static createConfirmation(
        message: string, header: string, accept: () => void, acceptLabel?: string, rejectLabel?: string, key?: string
    ): Confirmation {
        return {
            message: message,
            header: header,
            acceptLabel: acceptLabel,
            rejectLabel: rejectLabel,
            accept: accept,
            key: key
        };
    }
}
