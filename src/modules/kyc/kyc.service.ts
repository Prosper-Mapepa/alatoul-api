import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KYC, KYCStatus } from '../../entities/kyc.entity';
import { User, AccountStatus } from '../../entities/user.entity';

@Injectable()
export class KYCService {
  constructor(
    @InjectRepository(KYC)
    private kycRepository: Repository<KYC>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(userId: string, kycData: Partial<KYC>): Promise<KYC> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if KYC already exists
    const existingKYC = await this.kycRepository.findOne({
      where: { userId },
    });

    if (existingKYC) {
      // Update existing KYC
      Object.assign(existingKYC, kycData);
      return this.kycRepository.save(existingKYC);
    }

    const kyc = this.kycRepository.create({
      ...kycData,
      user,
      userId,
      status: KYCStatus.PENDING,
    });

    return this.kycRepository.save(kyc);
  }

  async findOne(userId: string): Promise<KYC | null> {
    const kyc = await this.kycRepository.findOne({
      where: { userId },
      relations: ['user'],
    });

    // Return null instead of throwing 404 - allows frontend to handle new users gracefully
    return kyc || null;
  }

  async update(userId: string, kycData: Partial<KYC>): Promise<KYC> {
    let kyc = await this.findOne(userId);
    
    // If KYC doesn't exist, create it
    if (!kyc) {
      return this.create(userId, kycData);
    }
    
    // Only assign valid fields to avoid database errors
    const validFields = [
      'firstName', 'lastName', 'dateOfBirth', 'nationality',
      'address', 'city', 'state', 'zipCode', 'country',
      'idType', 'idNumber', 'idFrontImage', 'idBackImage', 'idExpiryDate',
      'licenseNumber', 'licenseImage', 'licenseExpiryDate', 'licenseIssuedDate',
      'vehicleMake', 'vehicleModel', 'vehicleYear', 'vehiclePlateNumber', 'vehicleRegistrationImage',
      'bankName', 'accountNumber', 'accountHolderName',
      'mobileMoneyNumber', 'mobileMoneyProvider',
      'rejectionReason'
    ];
    
    // Filter and assign only valid fields
    const filteredData: any = {};
    for (const field of validFields) {
      if (kycData[field] !== undefined) {
        filteredData[field] = kycData[field];
      }
    }
    
    Object.assign(kyc, filteredData);
    return this.kycRepository.save(kyc);
  }

  async updateStatus(userId: string, status: KYCStatus, rejectionReason?: string): Promise<KYC> {
    const kyc = await this.findOne(userId);
    
    if (!kyc) {
      throw new NotFoundException('KYC not found');
    }
    
    kyc.status = status;
    
    if (status === KYCStatus.REJECTED && rejectionReason) {
      kyc.rejectionReason = rejectionReason;
    }

    // Update user status if approved
    if (status === KYCStatus.APPROVED) {
      const user = await this.userRepository.findOne({ where: { id: userId } });
      if (user) {
        // Set status to 'active' for drivers and passengers when KYC is approved
        user.status = AccountStatus.ACTIVE;
        await this.userRepository.save(user);
      }
    }

    return this.kycRepository.save(kyc);
  }

  async findAll(status?: KYCStatus): Promise<KYC[]> {
    const queryBuilder = this.kycRepository
      .createQueryBuilder('kyc')
      .leftJoinAndSelect('kyc.user', 'user');

    if (status) {
      queryBuilder.where('kyc.status = :status', { status });
    }

    return queryBuilder.getMany();
  }
}

