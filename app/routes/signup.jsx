import { useLoaderData, useActionData, useFetcher } from '@remix-run/react';
import { json, redirect } from '@remix-run/node';
import axios from 'axios';

import styles from '../styles/FormStyles.css';

export const links = () => [{ rel: 'stylesheet', href: styles }];

export let loader = async () => {
  const usersResponse = await axios.get(
    'https://jsonplaceholder.typicode.com/users'
  );
  return json(usersResponse.data);
};

export let action = async ({ request }) => {
  const formData = await request.formData();
  const title = formData.get('title');
  const body = formData.get('body');
  const userName = formData.get('userName');
  const isHuman = formData.get('isHuman');

  // Server-side validation
  if (!title || !body || !userName || !isHuman) {
    return json({ error: 'All fields are required' }, { status: 400 });
  }

  // Submitting data to the /posts endpoint
  const postResponse = await axios.post(
    'https://jsonplaceholder.typicode.com/posts',
    {
      title,
      body,
      userId: userName, // Assuming userName is the userId
    }
  );

  // Redirect to /profile with submitted data
  return redirect('/profile', {
    headers: {
      'Set-Cookie': `submittedData=${JSON.stringify(
        postResponse.data
      )}; Path=/; HttpOnly`,
    },
  });
};

export default function Signup() {
  const users = useLoaderData();
  const actionData = useActionData();
  const fetcher = useFetcher();
  const isSubmitting = fetcher.state === 'submitting';
  return (
    <fetcher.Form method='post' className='form'>
      <div className='form-group'>
        <label htmlFor='title' className='form-label'>
          Title:
        </label>
        <input
          className='form-input'
          type='text'
          id='title'
          name='title'
          required
        />
        {actionData?.errors.title && <p>{actionData.errors.title}</p>}
      </div>

      <div className='form-group'>
        <label htmlFor='body' className='form-label'>
          Body:
        </label>
        <textarea
          className='form-textarea'
          id='body'
          name='body'
          required
        ></textarea>
        {actionData?.errors.body && <p>{actionData.errors.body}</p>}
      </div>

      <div className='form-group'>
        <label className='form-label' htmlFor='userName'>
          UserName:
        </label>
        <select className='form-select' id='userName' name='userName' required>
          {users.map((user) => (
            <option className='form-option' key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
        {actionData?.errors.userName && <p>{actionData.errors.userName}</p>}
      </div>

      <div className='form-group'>
        <label className='form-label' htmlFor='isHuman'>
          <input
            className='form-checkbox'
            type='checkbox'
            id='isHuman'
            name='isHuman'
            required
          />
          I am a human
        </label>
        {actionData?.errors.isHuman && <p>{actionData.errors.isHuman}</p>}
      </div>

      <button disabled={isSubmitting} className='button' type='submit'>
        {isSubmitting ? `Submitting...` : `Submit`}
      </button>
    </fetcher.Form>
  );
}
