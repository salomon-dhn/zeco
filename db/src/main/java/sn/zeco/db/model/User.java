package sn.zeco.db.model;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="user")
public class User {
	@Id
	private long id;

	@NotEmpty(message="Firstname cannot be empty")
	private String pseudo;

	@NotEmpty(message="Password cannot be empty")
	private String password;

}
