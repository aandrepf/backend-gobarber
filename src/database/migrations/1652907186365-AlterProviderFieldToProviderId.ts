import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class AlterProviderFieldToProviderId1652907186365
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("appointments", "provider");
    await queryRunner.addColumn(
      "appointments",
      new TableColumn({
        name: "provider_id",
        type: "uuid",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "appointments",
      new TableForeignKey({
        name: "AppointmentProvider",
        columnNames: ["provider_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "SET NULL", // NO CASO DO PROVIDER NÃO EXISTIR MAIS, SETA NULL PARA TODOS OS RELACIONAMENTOS
        onUpdate: "CASCADE", // CASO O ID DO USER FOR ALTERADO, ESSA ALTERAÇÃO REFLETE EM TODOS OS RELACIONAMENTOS
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("appointments", "AppointmentProvider");
    await queryRunner.dropColumn("appointments", "provider_id");
    await queryRunner.addColumn(
      "apointments",
      new TableColumn({
        name: "provider",
        type: "varchar",
      })
    );
  }
}
