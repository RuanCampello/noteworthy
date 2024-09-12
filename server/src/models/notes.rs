use chrono::NaiveDateTime;
use sea_orm::{entity::prelude::*, FromQueryResult};
use serde::{Deserialize, Serialize};
use ts_rs::TS;

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

#[derive(Debug, FromQueryResult, Serialize, Deserialize, TS)]
#[ts(export, rename = "Note")]
#[serde(rename_all = "camelCase")]
pub struct NoteWithUserPrefs {
    #[ts(type = "string")]
    pub id: Uuid,
    pub title: String,
    pub content: String,
    pub colour: String,
    pub user_id: String,
    #[ts(type = "string")]
    pub created_at: NaiveDateTime,
    pub is_archived: bool,
    pub is_favourite: bool,
    pub is_public: bool,
    #[ts(type = "string")]
    pub last_update: NaiveDateTime,
    pub name: String,
    pub full_note: bool,
    pub note_format: String,
}

#[derive(FromQueryResult, Serialize, Debug, TS)]
#[ts(export, rename = "PartialNote")]
#[serde(rename_all = "camelCase")]
pub struct PartialNote {
    #[ts(type = "string")]
    pub id: Uuid,
    pub title: String,
    pub content: String,
    #[ts(type = "string")]
    pub colour: Colour,
    #[ts(type = "string")]
    pub created_at: NaiveDateTime,
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
