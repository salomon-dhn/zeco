package sn.zeco.db.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotEmpty;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name="users")
@SequenceGenerator(name="idSeq", initialValue=1, allocationSize=50)
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator="idSeq")
	private long id;

	@NotEmpty(message="Firstname cannot be empty")
	private String pseudo;

	@NotEmpty(message="Lastname cannot be empty")
	private String password;

}
