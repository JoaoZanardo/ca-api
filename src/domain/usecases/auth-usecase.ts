import { TokenGenerator } from "../../interfaces/token-generator";
import { Encrypter } from "../../interfaces/encrypter";
import { LoadUserByEmailRepository } from "src/interfaces/load-user-by-email-repository";
import { UpdateAccessTokenRepository } from "src/interfaces/update-access-token-repository";
import { User } from "../../interfaces/user";

export class AuthUseCase {
    constructor(
        private loadUserByEmailRepo: LoadUserByEmailRepository<User>,
        private encrypter: Encrypter,
        private tokenGenerator: TokenGenerator,
        private updateAccessTokenRepo: UpdateAccessTokenRepository
    ) { }

    async auth(email: string, password: string): Promise<null | string> {
        const user = await this.loadUserByEmailRepo.load(email);
        if (!user) return null;
        const isValid = await this.encrypter.compare(password, user.password);
        if (!isValid) return null;
        const accessToken = this.tokenGenerator.generate(user.id);
        await this.updateAccessTokenRepo.update(user.id, accessToken);
        return accessToken;
    }
}