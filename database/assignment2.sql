-- 1. Insert Tony Stark into the `account` table
INSERT INTO public.account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- 2. Modify Tony Stark's `account_type` to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- 3. Delete Tony Stark's record
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';
-- 4. Modify the "GM Hummer" description to replace "small interiors" with "a huge interior"
UPDATE public.inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- 5. Use an INNER JOIN to select the make, model, and classification name for inventory items in the "Sport" category
SELECT i.inv_make,
    i.inv_model,
    c.classification_name
FROM public.inventory i
    INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';
-- 6. Update all `inv_image` and `inv_thumbnail` paths to include "/vehicles"
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');