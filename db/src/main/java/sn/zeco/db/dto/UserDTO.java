package sn.zeco.db.dto;

import javax.persistence.Id;
import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@ApiModel(value = "User", description = "Represents a user either an admin or a simple one")
public class UserDTO {
	@Id
	@ApiModelProperty(value = "The identifier's user", example = "256")
	private long id;

	@ApiModelProperty(value = "The surname of user", example = "John", name = "Surname", required = true)
	@NotEmpty(message = "Surname cannot be empty")
	private String pseudo;

	@ApiModelProperty(value = "The name of user", example = "DOE", name = "Name", required = true)
	@NotEmpty(message = "Name cannot be empty")
	private String password;
}