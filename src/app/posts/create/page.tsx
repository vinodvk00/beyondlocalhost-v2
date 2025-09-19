import CreatePostForm from '@/components/posts/createPostForm';
import { ProtectedRoute } from '@/components/protected-route';

export default function CreatePostPage() {
    return (
        <ProtectedRoute>
            <CreatePostForm />
        </ProtectedRoute>
    );
}
