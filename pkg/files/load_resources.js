async function load_img(key, url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob);
        postMessage({ val: bitmap, key: key, is_ready: true });
    } catch (error) {
        self.postMessage({ error: error.message });
    }
}

async function load_imgs(key, urls) {
    try {
        var bitmaps = {};
        for (const url in urls) {
            const response = await fetch(urls[url]);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const blob = await response.blob();
            const bitmap = await createImageBitmap(blob);
            bitmaps[url] = bitmap;
        }
        postMessage({ val: bitmaps, key: key });
    } catch (error) {
        postMessage({ error: error.message });
    }
}

async function load_all() {
    await load_imgs('man',
        {
            s1: "../res/man/step (1).png",
            s2: "../res/man/step (2).png",
            s3: "../res/man/step (3).png",
            s4: "../res/man/step (4).png",
        }
    );
    await load_img('manDash',"../res/man/dash.png")
}

load_all().then(()=>{
    postMessage({is_ready: true})
})

