import { resetAuth } from "./features/auth/authSlice";
import http from "./lib/http";
import currencies from "./currency.json";
import { useSelector } from "react-redux";
import { RootState } from "./store";
import { parse } from 'node-html-parser';
import useAuth from "./hooks/useAuth";
const parse5 = require('parse5');
import { load } from 'cheerio';
import CryptoJS from 'crypto-js';





interface IRegisterFields {
  email: string;
  first_name: string;
  last_name: string;
  password: string;
}

interface ILoginFields {
  email: string;
  password: string;
}



export async function login({ email, password }: ILoginFields) {
  try {
    const res = await http.post(`/auth/login`, { email, password });
    return res.data;
  } catch (error: any) {
    throw new Error(error)
  }
}


export async function getUserByEmail({ email }: any) {
  try {
    const res = await http.get(`/get-user-by-email?email=${email}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error)
  }
}


export async function register({ body }: { body: IRegisterFields }) {
  try {
    const res = await http.post(`/auth/register`, body);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error
  }
}

export async function resetPassword({ body }: { body: any }) {
  try {
    const res = await http.post(`/auth/reset-password`, { ...body });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error
  }
}


export async function forgotPassword({ email }: { email: string }) {
  try {
    const res = await http.post(`/auth/forgot-password`, { email });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error
  }
}


export async function subscribe({ email }: { email: string }) {
  try {
    const res = await http.post(`/subscribe-to-newsletter?email=${email}`);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error
  }
}


export async function fetchBlogPosts() {
  try {
    const res = await http.get(`/blog`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchBlogPostByID(id: string) {
  try {
    const res = await http.get(`/get-blog-post-by-id?id=${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchSubSectionQuiz({ id }: any) {
  try {
    const res = await http.get(`/quiz/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCourses() {
  try {
    const res = await http.get(`/courses`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCourseById(id: string) {
  try {
    const res = await http.get(`/get-course-by-id?id=${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function fetchCourseEnrollment(course: string, user: string) {

  try {
    const res = await http.get(`/get-enrollment?course=${course}&user=${user}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}

export async function fetchUserEnrollments(user: string) {

  try {
    const res = await http.get(`/get-user-enrollments?user=${user}`);
    return res.data;
  } catch (error) {
    throw error;
  }
}


export async function createBlogPost({
  body,
  token,
}: {
  body: any;
  token: string | null;
}) {

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    console.log("body...", body);

    const res = await http.post(`/create-blog-post`, { ...body }, options);
    return res.data;
  } catch (error: any) {
    throw new Error(error)

  }
}
export async function createBlogPostDraft({
  body,
  token,
}: {
  body: any;
  token: string | null;
}) {

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await http.post(`/create-blog-post`, { ...body, status: 'inactive' }, options);
    return res.data;
  } catch (error: any) {
    throw new Error(error)

  }
}

export async function updateBlogPost({
  body,
  token,
  id
}: {
  body: any;
  token: string | null;
  id: string | null;
}) {

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await http.patch(`/update-blog-post?id=${id}`, body, options);
    return res.data;
  } catch (error: any) {
    throw new Error(error)

  }
}


export async function updateBlogPostDraft({
  body,
  token,
  id
}: {
  body: any;
  token: string | null;
  id: string | null;
}) {

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await http.patch(`/update-blog-post?id=${id}`, body, options);
    return res.data;
  } catch (error: any) {
    throw new Error(error)

  }
}

export async function fetchIdeaPostByID(id: string) {
  try {
    const res = await http.get(`/get-idea-post-by-id?id=${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}



export async function updateIdeaPost({
  body,
  token,
  id
}: {
  body: any;
  token: string | null;
  id: string | null;
}) {

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await http.patch(`/update-idea-post?id=${id}`, body, options);
    return res.data;
  } catch (error: any) {
    throw new Error(error)

  }
}


export async function updateCourse({
  body,
  token,
  id
}: {
  body: any;
  token: string | null;
  id: string | null;
}) {

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await http.patch(`/update-course?id=${id}`, body, options);
    return res.data;
  } catch (error: any) {
    throw new Error(error)

  }
}


export async function createIdeaPost({
  body,
  token,
}: {
  body: any;
  token: string | null;
}) {

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await http.post(`/create-idea-post`, body, options);
    return res.data;
  } catch (error: any) {
    throw new Error(error)

  }
}



export async function createIdeaPostDraft({
  body,
  token,
}: {
  body: any;
  token: string | null;
}) {

  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await http.post(`/create-idea-post?status=inactive`, body, options);
    return res.data;
  } catch (error: any) {
    throw new Error(error)

  }
}


export async function updateIdeaPostDraft({
  body,
  token,
  id
}: {
  body: any;
  token: string | null;
  id: string | null;
}) {

  console.log({ body });


  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await http.patch(`/update-idea-post?id=${id}`, body, options);
    return res.data;
  } catch (error: any) {
    throw new Error(error)

  }
}






export async function fetchCategories() {


  try {
    const res = await http.get(`/categories`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function createCategory({
  token,
  name,
}: {
  token: string | null;
  name: string;
}) {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await http.post(`/categories`, { name }, options);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function deleteCategory({
  token,
  id,
}: {
  token: string | null;
  id: number;
}) {
  const options = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const res = await http.delete(`/categories/${id}`, options);
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

export async function getSingleCourse({ id }: { id: string }) {
  try {
    const res = await http.patch(`/course/${id}`);
    return res.data;
  } catch (error: any) {
    throw new Error(error)
  }
}





export function getPriceBasedOnLocation({ country, prices }: any) {
  console.log();

  var coursePrice = prices?.find((price: any) => price.country_code.includes(country));
  var defaultPrice = prices?.find((price: any) => price.country_code.includes("US"));
  var listOfCurrencies: any = currencies;

  var price;
  var currency;
  var symbol;

  if (coursePrice) {
    currency = listOfCurrencies[coursePrice.currency].code;
    price = coursePrice?.price;
    symbol = listOfCurrencies[coursePrice.currency].symbol_native
  } else {
    currency = "USD";
    price = defaultPrice?.price;
    symbol = listOfCurrencies["USD"].symbol_native;
  }

  return [price, currency, symbol]
}


export function calculateReadingTime(text: String, wordsPerMinute = 200) {
  const wordCount = text?.trim().split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / wordsPerMinute);
  return readingTime;
}


export function getH1Content(htmlString: string) {
  const document = parse5.parse(htmlString);

  let h1Contents: string[] = [];

  function traverse(node: any) {
    if (node.nodeName === 'h1') {
      h1Contents.push(node.childNodes[0].value);

    }

    if (node.childNodes) {
      for (const childNode of node.childNodes) {
        traverse(childNode);
      }
    }
  }

  traverse(document);

  return h1Contents;
}


export function seperateBlogDataIntoComponents(htmlString: string) {
  var title = getH1Content(htmlString)[0];
  const content = htmlString.replace(/<h1>.*?<\/h1>/i, '');

  return [
    title,
    content
  ]
}


export function modifyHTMLString(htmlString: string) {
  const $ = load(htmlString);

  $('h1').remove(); // Remove all h1 elements

  $('h2').each((i, el) => {
    const id = `heading-${i}`;
    $(el).attr('id', id);
  });

  return $.html();
}

const secretKey = 'your-secret-key'; // Replace with your secret key
const iv = CryptoJS.enc.Hex.parse('YourInitializationVector'); // Initialization vector


export function encryptData(data: any): string {
  const jsonStr = JSON.stringify(data);
  const encrypted = CryptoJS.AES.encrypt(jsonStr, secretKey, { iv });
  return encrypted.toString();

}

export function decryptData(encryptedData: string): any {
  const decrypted = CryptoJS.AES.decrypt(encryptedData, secretKey, { iv });
  const jsonStr = decrypted.toString(CryptoJS.enc.Utf8);
  return JSON.parse(jsonStr);

}

export const handleSetCookie = async (object: any) => {
  const response = await fetch('/api/set-cookie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(object),
  });

  if (response.ok) {
    console.log('Cookie set successfully');
  } else {
    console.error('Failed to set cookie');
  }
}


export const handleDeleteCookie = async () => {
  const response = await fetch('/api/delete-cookie', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    // body: JSON.stringify(object),
  });

  if (response.ok) {
    console.log('Cookie deleted successfully');
  } else {
    console.error('Failed to delete cookie');
  }
}

export function extractListItems(htmlString: string) {
  if (typeof window === 'undefined') return;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Use querySelectorAll to select all <li> elements within the <ul>
  const liElements = doc.querySelectorAll('ul li');

  // Convert the NodeList to an array
  const liArray = Array.from(liElements);

  // Extract the text content of each <li> element
  const liTextArray = liArray.map((li) => li.textContent);

  return liTextArray;
}
