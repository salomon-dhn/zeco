package sn.zeco.db.mapper;

import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import sn.zeco.db.dto.UserDTO;
import sn.zeco.db.model.User;

@Mapper
public interface UserMapper {

	UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);


	UserDTO toDto(User user);

	@InheritInverseConfiguration
	User fromDto(UserDTO userDTO);
}

