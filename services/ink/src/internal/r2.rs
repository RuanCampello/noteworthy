use crate::errors::UserError;
use aws_sdk_s3::config::{BehaviorVersion, Credentials, Region, SharedCredentialsProvider};
use aws_sdk_s3::presigning::PresigningConfig;
use aws_sdk_s3::primitives::ByteStream;
use aws_sdk_s3::Client;
use std::time::Duration;

#[derive(Clone)]
pub struct R2 {
  client: Client,
  bucket: String,
}

impl R2 {
  pub async fn new(
    access_key: String,
    secret_key: String,
    endpoint: String,
    bucket: String,
  ) -> Self {
    let credentials = Credentials::new(access_key, secret_key, None, None, "custom");
    let timeout = aws_config::timeout::TimeoutConfig::builder()
      .connect_timeout(Duration::from_secs(30))
      .build();
    let shared_cred = SharedCredentialsProvider::new(credentials);
    let region = Region::new("us-east-1");

    let s3_config = aws_config::load_defaults(BehaviorVersion::v2024_03_28()).await;
    let s3 = aws_sdk_s3::config::Builder::from(&s3_config)
      .force_path_style(cfg!(debug_assertions))
      .credentials_provider(shared_cred)
      .endpoint_url(endpoint)
      .timeout_config(timeout)
      .region(region)
      .build();

    let client = Client::from_conf(s3);

    Self { client, bucket }
  }

  pub async fn get_object(&self, key: &str) -> Result<String, UserError> {
    let object = self
      .client
      .get_object()
      .bucket(&self.bucket)
      .key(key)
      .presigned(
        PresigningConfig::builder()
          .expires_in(Duration::from_secs(3600))
          .build()
          .unwrap(),
      )
      .await?;

    Ok(object.uri().to_string())
  }

  pub async fn create_object(&self, key: &str, image: Vec<u8>) -> Result<(), UserError> {
    let stream = ByteStream::from(image);

    let _ = self
      .client
      .put_object()
      .bucket(&self.bucket)
      .key(key)
      .body(stream)
      .content_type("image/png")
      .send()
      .await?;

    Ok(())
  }
}
