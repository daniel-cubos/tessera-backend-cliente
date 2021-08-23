create database api_restaurant;

create table if not exists clientes
(
	id serial unique primary key not null,
	nome varchar(100) not null,
	email varchar(100) not null,
	senha text not null
);

create table if not exists endereco
(
	id serial unique primary key not null,
	cliente_id integer not null,
  cep varchar(8) not null,
 	bairro varchar(30) not null,
 	localidade varchar(20) not null,
  logradouro varchar(100) not null,
 	complemento text not null,
 	uf varchar(2) not null,
  
  foreign key (cliente_id) references cliente (id)
);