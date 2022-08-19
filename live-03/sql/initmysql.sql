-- mysql
CREATE TABLE IF NOT EXISTS `my_apidb`.`api_user` (
    `uuid` INT NOT NULL AUTO_INCREMENT ,
    `username` VARCHAR(80) NOT NULL ,
    `password` VARCHAR(15) NOT NULL ,
    PRIMARY KEY (`uuid`)
) ENGINE = InnoDB CHARSET=utf8mb4 COLLATE utf8mb4_general_ci;

-- usando MD5 - OK
INSERT INTO api_user (username, password) VALUES ('usuario_1', MD5('abc123'));

-- inserir password criptografado - USANDO AES - DEU ERRO
INSERT INTO api_user (username, password) VALUES ('usuario_2', AES_ENCRYPT('abc123', 'my_app'));

-- consultar o password descriptografando
select nome, CAST(AES_DECRYPT(senha,'Chave_para_descriptografar') as char) from pessoa WHERE id ='2';