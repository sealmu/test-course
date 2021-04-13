import admin from 'firebase-admin';
import serviceAccount from '../credentials/firebase.json';

const crdentials = {
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
};

const firebaseConfig = {
    projectId: 'test-course-d1335',
    credential: admin.credential.cert(crdentials),
};

const initFirebase = (): { firebase: unknown; db: FirebaseFirestore.Firestore; admin: unknown } => {
    const initialized = admin.apps && admin.apps.length;
    const dbInitialized = globalThis.firebaseDb;

    globalThis.firebaseApp = !initialized ? admin.initializeApp(firebaseConfig) : admin.app();

    globalThis.firebaseDb = dbInitialized ? globalThis.firebaseDb : admin.firestore();

    return { firebase: globalThis.firebaseApp, db: globalThis.firebaseDb, admin };
};

export default initFirebase;
