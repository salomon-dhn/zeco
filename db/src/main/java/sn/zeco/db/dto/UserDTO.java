package sn.zeco.db.dto;


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

	@ApiModelProperty(value = "The surname of user", example = "John", name = "Surname", required = true)
	@NotEmpty(message = "Surname cannot be empty")
	private String pseudo;

	@ApiModelProperty(value = "The hash passwword of user", example = "f2d81a260dea8a100dd517984e53c56a7523d96942a834b9cdc249bd4e8c7aa9", name = "password", required = true)
	@NotEmpty(message = "Name cannot be empty")
	private String password;
}