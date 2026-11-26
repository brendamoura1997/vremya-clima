const IntroLandscape = () => {
  return (
    <section className="relative -mt-20 h-[clamp(17rem,25.5vw,32rem)] overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/landscape-light.png')] bg-cover bg-[position:58%_100%] bg-no-repeat [mask-image:linear-gradient(to_bottom,black_82%,transparent)] dark:bg-[url('/landscape-dark.png')]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-background via-background/85 to-transparent md:w-3/4"
      />
      <div className="container relative mx-auto px-7 pt-32">
        <h1 className="max-w-xl text-3xl leading-tight font-extrabold tracking-tight md:text-4xl lg:text-[2.8rem]">
          Olá, confira a previsão do tempo para a{" "}
          <span className="text-primary">sua cidade!</span>
        </h1>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          Informações precisas, atualizadas em tempo real.
        </p>
      </div>
    </section>
  );
};

export default IntroLandscape;
