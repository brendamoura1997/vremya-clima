const IntroLandscape = () => {
  return (
    <section className="relative -mt-20 h-[clamp(17rem,24vw,32rem)] overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[url('/landscape-light.png')] bg-cover bg-[position:88%_100%] bg-no-repeat [mask-image:linear-gradient(to_bottom,black_82%,transparent)] dark:bg-[url('/landscape-dark.png')]"
      />
      <div className="container relative mx-auto px-4 pt-28">
        <h1 className="max-w-xl text-3xl leading-tight font-extrabold tracking-tight md:text-4xl lg:text-[2.6rem]">
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
