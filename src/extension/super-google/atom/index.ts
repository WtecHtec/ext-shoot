import $ from 'jquery';

function findImageSearchBtn(): JQuery<HTMLElement> {
  return $('[aria-label="Search by image"]');
}

function findImageUploadInput(): JQuery<HTMLElement> {
  return $('form[enctype="multipart/form-data"] > input[name="encoded_image"]');
}

function findSearchTextarea(): JQuery<HTMLElement> {
  return $('textarea[aria-label="Search"]');
}

export const atom = {
  superGoogle: {
    findImageSearchBtn,
    findImageUploadInput,
    findSearchTextarea
  }
};
