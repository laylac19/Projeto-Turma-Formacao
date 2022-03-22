package br.com.turma.sgc.service.resource.exception;

public class DataIntegratyViolationException extends RuntimeException {

    public DataIntegratyViolationException(final String message) {
        this(message, null);
    }

    public DataIntegratyViolationException(final String message, final Throwable cause) {
        super(message, cause);
    }
}
