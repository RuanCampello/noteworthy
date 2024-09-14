use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "password_reset_tokens")]
pub struct Model {
  #[sea_orm(primary_key, column_type = "Text")]
  pub id: String,
  #[sea_orm(column_type = "Text")]
  pub email: String,
  #[sea_orm(column_type = "Text", unique)]
  pub token: String,
  pub expires: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
