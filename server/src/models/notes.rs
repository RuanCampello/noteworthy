use sea_orm::{entity::prelude::*, FromQueryResult};
use serde::{Deserialize, Serialize};

use super::sea_orm_active_enums::Colour;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "notes")]
#[serde(rename_all = "camelCase")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Uuid,
    #[sea_orm(column_type = "Text")]
    pub title: String,
    #[sea_orm(column_type = "Text")]
    pub content: String,
    pub colour: Colour,
    #[sea_orm(column_name = "userId", column_type = "Text")]
    pub user_id: String,
    pub created_at: DateTime,
    pub is_archived: bool,
    pub is_favourite: bool,
    pub is_public: bool,
    pub last_update: DateTime,
}

#[derive(Debug, FromQueryResult, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct NoteWithUserPrefs {
    pub id: Uuid,
    pub title: String,
    pub content: String,
    pub colour: String,
    pub user_id: String,
    pub created_at: DateTime,
    pub is_archived: bool,
    pub is_favourite: bool,
    pub is_public: bool,
    pub last_update: DateTime,
    pub name: String,
    pub full_note: bool,
    pub note_format: String,
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
