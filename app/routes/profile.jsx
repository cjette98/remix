import { useLoaderData } from '@remix-run/react';

import styles from '../styles/ProfileStyles.css';

export const links = () => [{ rel: 'stylesheet', href: styles }];

// Loader to read session cookie
export let loader = async ({ request }) => {
    const cookieHeader = request.headers.get('Cookie');
    const cookies = new Map(
        cookieHeader?.split(';').map((c) => c.trim().split('='))
    );
    const submittedData = cookies.get('submittedData');

    if (!submittedData) {
        return { submittedData: null };
    }

    return { submittedData: JSON.parse(decodeURIComponent(submittedData)) };
};

export default function Profile() {
    const { submittedData } = useLoaderData();

    if (!submittedData) {
        return <div>No data submitted yet. Please fill out the form.</div>;
    }

    return (
        <div className='submitted-data-container'>
            <h1 className='submitted-data-header'>Submitted Data</h1>
            <p className='submitted-data-paragraph'>
                <strong className='submitted-data-bold'>Title:</strong>{' '}
                {submittedData.title}
            </p>
            <p className='submitted-data-paragraph'>
                <strong className='submitted-data-bold'>Body:</strong>{' '}
                {submittedData.body}
            </p>
            <p className='submitted-data-paragraph'>
                <strong className='submitted-data-bold'>User ID:</strong>{' '}
                {submittedData.userId}
            </p>
        </div>
    );
}
