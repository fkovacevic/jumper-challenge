/** @type {import('next').NextConfig} */
const nextConfig = {
    sassOptions: {
        implementation: 'sass-embedded',
        includePaths: ['./src'],
        prependData: `@import "styles/global.scss";`,
      },
};

export default nextConfig;
