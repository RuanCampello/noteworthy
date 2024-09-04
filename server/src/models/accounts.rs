//! `SeaORM` Entity, @generated by sea-orm-codegen 1.0.0-rc.5

use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "account")]
pub struct Model {
    #[sea_orm(column_name = "userId", column_type = "Text")]
    pub user_id: String,
    #[sea_orm(column_type = "Text")]
    pub r#type: String,
    #[sea_orm(primary_key, auto_increment = false, column_type = "Text")]
    pub provider: String,
    #[sea_orm(
        column_name = "providerAccountId",
        primary_key,
        auto_increment = false,
        column_type = "Text"
    )]
    pub provider_account_id: String,
    #[sea_orm(column_type = "Text", nullable)]
    pub refresh_token: Option<String>,
    #[sea_orm(column_type = "Text", nullable)]
    pub access_token: Option<String>,
    pub expires_at: Option<i32>,
    #[sea_orm(column_type = "Text", nullable)]
    pub token_type: Option<String>,
    #[sea_orm(column_type = "Text", nullable)]
    pub scope: Option<String>,
    #[sea_orm(column_type = "Text", nullable)]
    pub id_token: Option<String>,
    #[sea_orm(column_type = "Text", nullable)]
    pub session_state: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::users::Entity",
        from = "Column::UserId",
        to = "super::users::Column::Id",
        on_update = "NoAction",
        on_delete = "Cascade"
    )]
    Users,
}

impl Related<super::users::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Users.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
