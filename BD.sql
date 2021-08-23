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
  endereco varchar(100) not null,
 	complemento text not null,
  
  foreign key (cliente_id) references cliente (id)
);

create table if not exists pedido
(
	id serial unique primary key not null,
	cliente_id integer not null,
	restaurante_id integer not null,
  subtotal integer not null,
 	taxa_entrega integer not null,
 	total_pedido integer not null,

  foreign key (cliente_id) references cliente (id),
  foreign key (restaurante_id) references restaurante (id)
);

create table if not exists itens_pedido
(
	id serial unique primary key not null,
	pedido_id integer not null,
	produto_id integer not null,
	quantidade_itens integer not null,
	
  foreign key (pedido_id) references pedido (id),
  foreign key (produto_id) references produto (id)
);