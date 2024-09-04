use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "users")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false, column_type = "Text")]
    pub id: String,
    #[sea_orm(column_type = "Text", nullable)]
    pub name: Option<String>,
    #[sea_orm(column_type = "Text", nullable, unique)]
    pub email: Option<String>,
    #[sea_orm(column_name = "emailVerified")]
    pub email_verified: Option<DateTime>,
    #[sea_orm(column_type = "Text", nullable)]
    pub password: Option<String>,
    #[sea_orm(column_type = "Text", nullable)]
    pub image: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::accounts::Entity")]
    Account,
    #[sea_orm(has_many = "super::notes::Entity")]
    Notes,
    #[sea_orm(has_one = "super::users_preferences::Entity")]
    UsersPreferences,
}

impl Related<super::accounts::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Account.def()
    }
}

impl Related<super::notes::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Notes.def()
    }
}

impl Related<super::users_preferences::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::UsersPreferences.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
