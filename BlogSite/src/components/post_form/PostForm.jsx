import React, { useCallback, useEffect } from 'react'

import { useForm } from 'react-hook-form'

import { Button, Input, Select, RTE } from "../index"

import bucket from "../../appwrite/Bucket"

import database from "../../appwrite/Database"

import { useDispatch, useSelector } from 'react-redux'

import { addPost, updatePost } from "../../store/PostSlice"

import { useNavigate } from 'react-router-dom'


function PostForm({ post }) {

    const { register, control, handleSubmit, watch, getValues, setValue } = useForm({
        defaultValues: {

            title: post?.title || " ",
            slug: post?.slug || " ",
            content: post?.content || " ",
            status: post?.status || " "
        }
    });

    const navigate = useNavigate();

    const dispatch = useDispatch();

    // Get actual user data from Redux
    const userData = useSelector((state) => state.auth.userData);


    // Convert title into slug
    const slugTransform = useCallback((value) => {

        if (value && typeof value === "string")

            return value
                .trim()
                .toLowerCase()
                .replace(/[^a-zA-Z\d\s]+/g, "-") // regex to convert space to underscore
                .replace(/\s/g, "-");

        return "";

    }, [])


    // Automatically create slug when title changes
    useEffect(() => {

        const subscription = watch((value, { name }) => {

            if (name === "title") {

                setValue(
                    "slug",
                    slugTransform(value.title),
                    { shouldValidate: true }
                );

            }

        });

        return () => {

            subscription.unsubscribe()

        } // it will stop if u unsubscribe it

    }, [watch, slugTransform, setValue])


    const submit = async (data) => {

        // post is there
        if (post) {

            // upload new image only if user selected one
            const file = data.image?.[0]
                ? await bucket.uploadFile(data.image[0])
                : null;

            if (file) {

                // delete old file
                await bucket.deleteFile(post.featuredImage);

            }

            const dbPost = await database.updatePost(post.$id, {

                ...data,

                featuredImage: file
                    ? file.$id
                    : post.featuredImage

            });

            if (dbPost) {

                // update post in Redux
                dispatch(updatePost(dbPost));

                navigate(`/post/${dbPost.$id}`);

            }

        }

        // post is not there
        else {

            // upload image
            const file = data.image?.[0]
                ? await bucket.uploadFile(data.image[0])
                : null;

            const dbPost = await database.createPost({

                ...data,

                // add featured image only if uploaded
                featuredImage: file ? file.$id : undefined,

                userId: userData.$id

            });

            if (dbPost) {

                // add new post to Redux
                dispatch(addPost(dbPost));

                navigate(`/post/${dbPost.$id}`);

            }

        }

    }


    return (

        <form onSubmit={handleSubmit(submit)}>

            <div className="w-2/3 px-2">

                <Input
                    label="Title :"
                    placeholder="Title"
                    className="mb-4"
                    {...register("title", { required: true })}
                />

                <Input
                    label="Slug :"
                    placeholder="Slug"
                    className="mb-4"
                    {...register("slug", { required: true })}
                    onInput={(e) => {

                        setValue(
                            "slug",
                            slugTransform(e.currentTarget.value),
                            { shouldValidate: true }
                        );

                    }}
                />

                <RTE
                    label="Content :"
                    name="content"
                    control={control}
                    defaultValue={getValues("content")}
                />

            </div>


            <div className="w-1/3 px-2">

                <Input
                    label="Featured Image :"
                    type="file"
                    className="mb-4"
                    accept="image/png, image/jpg, image/jpeg, image/gif"
                    {...register("image", { required: !post })}
                />


                {post && (

                    <div className="w-full mb-4">

                        <img
                            src={bucket.getFilePreview(post.featuredImage)}
                            alt={post.title}
                            className="rounded-lg"
                        />

                    </div>

                )}


                <Select
                    options={["active", "inactive"]}
                    label="Status"
                    className="mb-4"
                    {...register("status", { required: true })}
                />


                <Button
                    type="submit"
                    bgColor={post ? "bg-green-500" : undefined}
                    className="w-full"
                >
                    {post ? "Update" : "Submit"}
                </Button>

            </div>

        </form>

    )

}

export default PostForm

// One thing you must check

// I changed:
// const userData = useSelector((state) => state.auth.status)
// ```

// to:

// ```jsx
// const userData = useSelector((state) => state.auth.userData)
// ```

// because later you use:

// ```jsx
// userData.$id
// ```

// `status` is normally a boolean (`true`/`false`), so it cannot have `$id`.

// If your `AuthSlice` uses a different property name such as `user`, then change `userData` accordingly.

// Also, your `PostSlice` must be added to the Redux store:

// ```jsx
// post: PostReducer
// ```

// so that `dispatch(addPost(dbPost))` and `dispatch(updatePost(dbPost))` work.
