use image;
use image::imageops::FilterType;
use image::ImageFormat;
use std::io::Cursor;

pub fn resize_and_reduce_image(file_bytes: Vec<u8>) -> Result<Vec<u8>, image::ImageError> {
  let image = image::load_from_memory(&file_bytes)?;
  let resized_image = image.resize(112, 112, FilterType::Nearest);

  let mut output = Cursor::new(Vec::new());
  resized_image.write_to(&mut output, ImageFormat::Jpeg)?;

  Ok(output.into_inner())
}
