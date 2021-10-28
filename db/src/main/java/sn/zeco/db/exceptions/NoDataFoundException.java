package sn.zeco.db.exceptions;

@SuppressWarnings("serial")
public class NoDataFoundException extends RuntimeException {

	public NoDataFoundException() {
		super("No Data Found");
	}
}
